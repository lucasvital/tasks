import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/taskdb");
    console.log("Banco de dados conectado com sucesso");
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados", error);
    process.exit(1); // Finaliza o processo caso a conexão falhe
  }
};

export default connectDB;
