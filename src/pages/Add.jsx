import axios from "axios";
import { useState } from "react";
import { assets } from "../assets/assets";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

export const backendUrls = import.meta.env.VITE_BACKEND_URL;

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Vegetables");
  const [subCategory, setSubCategory] = useState("Fresh");
  const [bestseller, setBestseller] = useState(false);
  const [minOrderQuantity, setMinOrderQuantity] = useState("1");
  const [enableMinOrder, setEnableMinOrder] = useState(false);
  const [enableQuantityPriceList, setEnableQuantityPriceList] = useState(false);
  const [quantityPriceList, setQuantityPriceList] = useState([
    { quantity: "100", price: "95" },
    { quantity: "250", price: "140" },
    { quantity: "500", price: "210" },
    { quantity: "1000", price: "325" }
  ]);

  const handleQuantityPriceChange = (index, field, value) => {
    const newList = [...quantityPriceList];
    newList[index][field] = value;
    setQuantityPriceList(newList);
  };

  const addQuantityPriceItem = () => {
    setQuantityPriceList([...quantityPriceList, { quantity: "", price: "" }]);
  };

  const removeQuantityPriceItem = (index) => {
    const newList = quantityPriceList.filter((_, i) => i !== index);
    setQuantityPriceList(newList);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);

      // Only set minOrderQuantity if enabled
      if (enableMinOrder && minOrderQuantity) {
        formData.append("minOrderQuantity", minOrderQuantity);
      }

      // Add quantity price list if enabled
      if (enableQuantityPriceList) {
        formData.append("quantityPriceList", JSON.stringify(quantityPriceList));
      }

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
        setMinOrderQuantity("1");
        setEnableMinOrder(false);
        setEnableQuantityPriceList(false);
        setQuantityPriceList([
          { quantity: "100", price: "95" },
          { quantity: "250", price: "140" },
          { quantity: "500", price: "210" },
          { quantity: "1000", price: "325" }
        ]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          <label htmlFor="image1">
            <img
              className="w-25"
              src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
              alt=""
            />
            <input
              onChange={(e) => setImage1(e.target.files[0])}
              type="file"
              id="image1"
              hidden
            />
          </label>

          <label htmlFor="image2">
            <img
              className="w-25"
              src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
              alt=""
            />
            <input
              onChange={(e) => setImage2(e.target.files[0])}
              type="file"
              id="image2"
              hidden
            />
          </label>

          <label htmlFor="image3">
            <img
              className="w-25"
              src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
              alt=""
            />
            <input
              onChange={(e) => setImage3(e.target.files[0])}
              type="file"
              id="image3"
              hidden
            />
          </label>

          <label htmlFor="image4">
            <img
              className="w-25"
              src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
              alt=""
            />
            <input
              onChange={(e) => setImage4(e.target.files[0])}
              type="file"
              id="image4"
              hidden
            />
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2 "
          type="text"
          placeholder="Type here"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2 "
          type="text"
          placeholder="Type context here"
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2"
          >
            <option value="None" selected>
              None
            </option>
            <option value="Prescription">Prescription Medicines</option>
            <option value="OTC">Over The Counter</option>
            <option value="Healthcare">Healthcare Devices</option>
            <option value="Wellness">Wellness Products</option>
            <option value="Personal Care">Personal Care</option>
            <option value="Ayurvedic">Ayurvedic Medicines</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Sub Category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full px-3 py-2"
          >
            <option value="None" selected>
              None
            </option>
            <option value="Tablets">Tablets</option>
            <option value="Capsules">Capsules</option>
            <option value="Syrups">Syrups</option>
            <option value="Injectables">Injectables</option>
            <option value="Topical">Topical Applications</option>
            <option value="Drops">Drops</option>
            <option value="Equipment">Medical Equipment</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="Number"
            placeholder="25"
          />
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setEnableMinOrder((prev) => !prev)}
          checked={enableMinOrder}
          type="checkbox"
          id="enableMinOrder"
        />
        <label className="cursor-pointer" htmlFor="enableMinOrder">
          Set Minimum Order Quantity
        </label>
      </div>

      {enableMinOrder && (
        <div>
          <p className="mb-2">Minimum Order Quantity</p>
          <input
            onChange={(e) => setMinOrderQuantity(e.target.value)}
            value={minOrderQuantity}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="Number"
            min="1"
            placeholder="1"
          />
        </div>
      )}

      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to Best Seller
        </label>
      </div>

      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setEnableQuantityPriceList((prev) => !prev)}
          checked={enableQuantityPriceList}
          type="checkbox"
          id="enableQuantityPriceList"
        />
        <label className="cursor-pointer" htmlFor="enableQuantityPriceList">
          Enable Quantity Price List
        </label>
      </div>

      {enableQuantityPriceList && (
        <div className="w-full max-w-[500px]">
          <p className="mb-2">Quantity Price List</p>
          <div className="border border-gray-200 rounded-lg p-4">
            {quantityPriceList.map((item, index) => (
              <div key={index} className="flex gap-4 mb-3 items-center">
                <div className="flex-1">
                  <label className="text-sm text-gray-600 mb-1 block">Quantity</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityPriceChange(index, 'quantity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    placeholder="Enter quantity"
                    min="1"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-600 mb-1 block">Price ($)</label>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => handleQuantityPriceChange(index, 'price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    placeholder="Enter price"
                    min="0"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeQuantityPriceItem(index)}
                  className="mt-6 p-2 text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addQuantityPriceItem}
              className="mt-2 px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1"
            >
              <span>+</span> Add Price Option
            </button>
          </div>
        </div>
      )}

      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
        ADD
      </button>
    </form>
  );
};

export default Add;
