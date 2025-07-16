import mergeSort from '../utils/algorithms/mergeSort.js';
import { getFoodById, updateFood, deleteFood } from '../controllers/foodController.js';
import foodController from '../controllers/foodController.js';
import foodModel from "../models/foodModel.js";
import fs from "fs";



//  mergeSort.js

function mergeSort(arr, key = 'price') {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), key);
  const right = mergeSort(arr.slice(mid), key);

  return merge(left, right, key);
}

function merge(left, right, key) {
  const result = [];

  while (left.length && right.length) {
    if (left[0][key] < right[0][key]) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }

  return [...result, ...left, ...right];
}





export default mergeSort;
export { mergeSort };