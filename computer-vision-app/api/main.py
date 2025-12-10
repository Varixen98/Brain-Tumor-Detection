# FastAPI libraries
import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# load model library
import joblib

# load utilities libraries
import numpy as np
import cv2
from skimage.feature import local_binary_pattern, graycomatrix, graycoprops, hog
import io
import os

model = None
scaler = None

# Initialize variables globally to avoid "not defined" error
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "svc_bt_classification_model(128px).joblib")
SCALER_PATH = os.path.join(BASE_DIR, "model", "scaler.joblib")

# initialisasi app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"], # yang memungkinkan GET, DELETE, POST, PUT
    allow_headers=["*"],
)

# load model, scaler, and loader
try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    print("Model, and scaler are succesfully loaded!")
except Exception as e:
    print(f"Error loading resource: {e}")


class Preprocessor:
    def __init__(self, ksize=(3, 3), clip_limit=2.0, tile_size=(4, 4)):
        self.ksize = ksize
        self.clip_limit = clip_limit
        self.tile_size = tile_size
        self.clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=tile_size)

    def process_img(self, img):

        # check img channel
        if len(img.shape) == 3:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        else:
            gray = img

        # Gaussian blur
        smoothed = cv2.GaussianBlur(gray, ksize=self.ksize, sigmaX=0)

        # enhanced image
        enhanced = self.clahe.apply(smoothed)

        return enhanced


class ExtractFeature:
    def glcm_feature(self, img):
        img_glcm = img.astype(np.uint8)
        glcm = graycomatrix(img_glcm, 
                            distances=[1], 
                            angles=[0], 
                            levels=256,
                            symmetric=True,
                            normed=True)

        f_contrast = graycoprops(glcm, "contrast")[0,0]
        f_energy = graycoprops(glcm, "energy")[0,0]
        f_homogeneity = graycoprops(glcm, "homogeneity")[0,0]
        f_correlation = graycoprops(glcm, "correlation")[0,0]

        return np.array([f_contrast, f_energy, f_homogeneity, f_correlation])

    def lbp_feature(self, img):
        radius = 3
        n_points = 8 * radius
        lbp = local_binary_pattern(img, n_points, radius, method="uniform")
        f_lbp, _ = np.histogram(lbp.ravel(), 
                            bins=np.arange(0, n_points + 3), 
                            range=(0, n_points + 2), 
                            density=True)
        return f_lbp

    def hog_feature(self, img):
        img_norm = img/255.0 if img.max() > 1.0 else img
        f_hog = hog(img_norm,
                    orientations=9,
                    pixels_per_cell=(16, 16),
                    cells_per_block=(2, 2),
                    transform_sqrt=True,
                    block_norm="L2-Hys",
                    visualize=False)

        return f_hog


    def extract_all_features(self, img):
        f_glcm = self.glcm_feature(img)
        f_lbp = self.lbp_feature(img)
        f_hog = self.hog_feature(img)

        return np.hstack([f_glcm, f_lbp, f_hog])



# Initialize helpers
preprocessor = Preprocessor(ksize=(3,3), clip_limit=2.0, tile_size=(8,8))
extractor = ExtractFeature()
IMG_SIZE = (128, 128)



# Class labels prediction
CLASS_LABELS = {
    0: "glioma",
    1: "meningioma",
    2: "no tumor",
    3: "pituitary"
}


# root function
@app.get("/")
async def root():
    return {"message": "Hello world from FastAPI!"}


#predict function
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # read img
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image file!")
        
        # resize
        img_resized = cv2.resize(img, 
                                dsize=IMG_SIZE, 
                                interpolation=cv2.INTER_AREA)

        # preprocess img Gaussian + CLAHE
        img_preprocessed = preprocessor.process_img(img_resized)

        # extract feature
        features = extractor.extract_all_features(img_preprocessed)

        # scale feature
        features_scaled = scaler.transform(features.reshape(1, -1))

        # Predict
        prediction_idx = int(model.predict(features_scaled)[0])
        prediction_label =CLASS_LABELS[prediction_idx]

        return {
            "message": "successfully predict",
            "prediction": prediction_label,
            "class_number": prediction_idx
        }

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

