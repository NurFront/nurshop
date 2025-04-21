import { useRef, useState, useEffect } from "react";
import axios from "axios";
import '../styles/adminpanel.css'
import { Upload, Send } from "@mui/icons-material"
import Header from "./Header";

const cloudName = "dnqcy6mq7";
const uploadPreset = "unsigned_preset";

const AdminPanel = () => {
    const [imageUrls, setImageUrls] = useState<any[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [price, setPrice] = useState<string>("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        try {
            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/dnqcy6mq7/image/upload`,
                formData
            );
            const imageUrl = res.data.secure_url;

            const productData = {
                name,
                description,
                price,
                url: imageUrl
            };

            const response = await axios.post("/api/save-image", productData);
            console.log(response.data.message);

            setImageUrls((prev) => [...prev, productData]);
            setFile(null);
            setName("");
            setDescription("");
            setPrice("");
        } catch (error) {
            console.error("Ошибка при загрузке изображения:", error);
        }
    };

    useEffect(() => {
        axios.get("/api/get-images")
            .then((response) => {
                setImageUrls(response.data);
            })
            .catch((error) => {
                console.error("Ошибка при получении изображений:", error);
            });
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`/api/delete-image/${id}`);
            setImageUrls(prev => prev.filter(img => img.id !== id));
        } catch (error) {
            console.error("Ошибка при удалении:", error);
        }
    };


    return (
        <div>
            <Header />
            <div className="admin-panel">
                <input
                    type="file"
                    ref={fileInputRef}
                    id="file-upload"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
                <div className="admin-panel-content">

                    <label htmlFor="file-upload" className="custom-button">
                        {file ? (
                            <img
                                src={URL.createObjectURL(file)}
                                alt="Selected"
                                className="uploaded-image"
                            />
                        ) : (
                            <Upload sx={{ color: 'greenyellow' }} />
                        )}
                    </label>


                    <div className="input-items-admin">
                        <input
                            type="text"
                            className="input-admin"
                            placeholder="Введите название..."
                            value={name}
                            maxLength={20}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <textarea
                            className="input-admin"
                            placeholder="Введите описание..."
                            rows={5}
                            id="description"
                            maxLength={65}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <input
                            type="text"
                            className="input-admin"
                            placeholder="Введите цену..."
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            maxLength={20}
                        />
                    </div>

                    <button className="custom-button-upload" onClick={handleUpload} disabled={!file || !name || !price}>
                        <Send sx={{ color: 'greenyellow' }} />
                    </button>
                </div>

                <div className="image-gallery">
                    {imageUrls.map((image, index) => (
                        <div key={index} className="image-card-admin">
                            <img src={image.url} alt={`preview-${index}`} />
                            <div className="card-content">
                                <h3>{image.name}</h3>
                                <p>{image.description}</p>
                                <p>Цена: {Number(image.price) % 1 === 0 ? Number(image.price).toFixed(0) : Number(image.price).toFixed(2)}₽</p>
                                <button onClick={() => handleDelete(image.id)} className="delete-btn">
                                    Удалить
                                </button>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
            <div className="nur"></div>
        </div>
    );
};

export default AdminPanel;
