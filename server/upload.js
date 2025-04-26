const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const cloudinary = require("cloudinary").v2;
require("dotenv").config({ path: "../.env" });

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database.");
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.post("/api/save-image", (req, res) => {
  const { url, name, description, price } = req.body;

  if (!url || !name || !description || !price) {
    return res.status(400).json({ message: "Не все данные указаны" });
  }

  const query =
    "INSERT INTO images (url, name, description, price) VALUES (?, ?, ?, ?)";
  db.query(query, [url, name, description, price], (err, result) => {
    if (err) {
      console.error("Ошибка при сохранении:", err);
      return res
        .status(500)
        .json({ message: "Ошибка при сохранении изображения" });
    }
    res.status(200).json({ message: "Изображение и данные сохранены" });
  });
});

app.get("/api/get-images", (req, res) => {
  const query = "SELECT * FROM images";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching images" });
    }
    res.json(results);
  });
});

app.delete("/api/delete-image/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM images WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Ошибка при удалении:", err);
      return res
        .status(500)
        .json({ message: "Ошибка при удалении изображения" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Изображение не найдено" });
    }

    res.status(200).json({ message: "Изображение удалено" });
  });
});

const PORT = 3005;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
