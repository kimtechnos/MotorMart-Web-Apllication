import { useState } from "react";
import PropTypes from "prop-types";

const ImageUpload = ({ onUpload }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append("file", image);

    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    if (!uploadPreset || !cloudName) {
      throw new Error("Image upload is not configured");
    }
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await response.json();
      console.log("Response data:", data);
      if (!data.secure_url)
        throw new Error(data.error.message || "Image upload failed.");
      return data.secure_url;
    } catch (err) {
      console.error("Upload error:", err);
      throw err;
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      setLoading(true);
      setError(null);
      try {
        const imageUrl = await uploadImage(file);
        onUpload(imageUrl);
      } catch (err) {
        setError(err.message || "Image upload failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        id="imageInput"
        accept="image/*"
        onChange={handleFileChange}
      />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

ImageUpload.propTypes = {
  onUpload: PropTypes.func,
};

export default ImageUpload;
