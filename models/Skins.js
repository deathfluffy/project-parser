import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSettings } from "./hooks.js";

const SkinSchema = new Schema({
  name: {
    type: String,
  },
  rarity : {
    type: String,
  },
}, { versionKey: false });


SkinSchema.post("save", handleSaveError);
SkinSchema.pre("findOneAndUpdate", setUpdateSettings);
SkinSchema.post("findOneAndUpdate", handleSaveError);

const Skin = model("Skin", SkinSchema);

export default Skin;
