require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const PORT = 4002;
const url = "mongodb://localhost:27017/automate";

const data = [
  {
    firstName: "amit",
    lastName: "kumar",
    email: "amit@gmail.com",
    password: "default",
  },
  {
    firstName: "raj",
    lastName: "kumar",
    email: "raj@gmail.com",
    password: "default",
  },
];

const connectDB = () => {
  mongoose.set("strictQuery", true);
  return mongoose
    .connect(url)
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => console.log(err));
};

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: Object, default: null },
    verified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    resetToken: { type: Object, default: null },
  },
  { timestamps: true, versionKey: false }
);

const User = mongoose.model("User", userSchema);

async function precompute() {
  try {
    for (let i = 0; i < data.length; ++i) {
      const { firstName, lastName, email, password } = data[i];
      const hashedPwd = await bcrypt.hash(password, 10);

      const payload = {
        firstName,
        lastName,
        email,
        password: hashedPwd,
      };

      const user = await User.create(payload);
      console.log(`User ${i + 1} Added`);
    }
  } catch (err) {
    console.log("Error Adding Users. Delete database and try to add again");
    process.exit(-1);
  }
}

app.listen(PORT, async (req, res) => {
  console.log(`Server is listening on ${PORT}`);
  await connectDB();
  await precompute();
  console.log("Users Added Successfully");
  process.exit(0);
});
