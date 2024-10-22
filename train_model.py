import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras import layers, models

# إعداد مسار البيانات
data_dir = "Pipe_Dataset"

# إعداد مولد البيانات مع عمليات التحجيم وتقسيم البيانات
datagen = ImageDataGenerator(rescale=1.0/255, validation_split=0.2)

# إعداد مولد بيانات التدريب
train_generator = datagen.flow_from_directory(
    data_dir,
    target_size=(224, 224),
    batch_size=32,
    class_mode='sparse',
    subset='training'
)

# إعداد مولد بيانات التحقق
validation_generator = datagen.flow_from_directory(
    data_dir,
    target_size=(224, 224),
    batch_size=32,
    class_mode='sparse',
    subset='validation'
)

# تحميل نموذج MobileNetV2
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))

# تجميد الطبقات الأساسية للنموذج
base_model.trainable = False

# بناء الطبقات العلوية للنموذج
model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(128, activation='relu'),
    layers.Dense(train_generator.num_classes, activation='softmax')  # تحديد عدد الفئات بناءً على بياناتك
])

# تجميع النموذج
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# تدريب النموذج
model.fit(train_generator, epochs=10, validation_data=validation_generator)

# حفظ النموذج المدرب
model.save('pipe_classification_model.h5')
