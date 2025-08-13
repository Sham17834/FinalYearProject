import joblib
from skl2onnx import convert_sklearn, register_converter
from skl2onnx.common.data_types import FloatTensorType
from skl2onnx.common.shape_calculator import calculate_linear_classifier_output_shapes
from onnxconverter_common import convert_onnx
import onnx
from sklearn.multioutput import MultiOutputClassifier
import xgboost
import numpy as np

# Register shape calculator and converter for XGBClassifier
def xgb_classifier_shape_calculator(operator):
    calculate_linear_classifier_output_shapes(operator)

def xgb_classifier_converter(scope, operator, container):
    convert_onnx(
        scope=scope,
        operator=operator,
        container=container,
        op_type='TreeEnsembleClassifier',
        classes=operator.raw_operator.classes_,
        class_type=np.int64,
        tree_weight=np.float32(1.0),
    )

register_converter('XGBClassifier', xgb_classifier_converter, shape_calculator=xgb_classifier_shape_calculator)

# Load the MultiOutputClassifier model
model = joblib.load(r'C:\IT\FYP\React Native\HealthApps\api\XGBoost_model.pkl')

# Load selected features
selected_features = joblib.load(r'C:\IT\FYP\React Native\HealthApps\api\selected_features_final.pkl')
num_features = len(selected_features)
initial_types = [('float_input', FloatTensorType([None, num_features]))]

# Check if the model is a MultiOutputClassifier
if isinstance(model, MultiOutputClassifier):
    classifiers = model.estimators_
    print(f"Found {len(classifiers)} XGBClassifier models for multi-output prediction")

    # Convert each XGBClassifier to ONNX
    for i, clf in enumerate(classifiers):
        try:
            # Ensure the classifier has classes_ attribute
            if not hasattr(clf, 'classes_'):
                clf.classes_ = np.array([0, 1])  # Adjust based on your model’s classes
            onnx_model = convert_sklearn(clf, initial_types=initial_types, target_opset=12)
            output_path = f'C:\\IT\\FYP\\React Native\\HealthApps\\api\\xgb_model_output_{i}.onnx'
            with open(output_path, 'wb') as f:
                onnx.save(onnx_model, f)
            print(f"Saved ONNX model for output {i} at {output_path}")
        except Exception as e:
            print(f"Failed to convert model for output {i}: {str(e)}")
else:
    onnx_model = convert_sklearn(model, initial_types=initial_types, target_opset=12)
    with open(r'C:\IT\FYP\React Native\HealthApps\api\xgb_model.onnx', 'wb') as f:
        onnx.save(onnx_model, f)
    print("Saved single ONNX model")