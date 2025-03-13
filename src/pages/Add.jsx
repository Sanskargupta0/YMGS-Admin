import axios from "axios";
import { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import PropTypes from 'prop-types';

export const backendUrls = import.meta.env.VITE_BACKEND_URL;

const Add = ({ token, editMode = false, product = null, onEditComplete = null }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToReplace, setImagesToReplace] = useState({});

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("None");
  const [subCategory, setSubCategory] = useState("None");
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

  useEffect(() => {
    if (editMode && product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setCategory(product.category);
      setSubCategory(product.subCategory);
      setBestseller(product.bestseller);
      setMinOrderQuantity(product.minOrderQuantity.toString());
      setEnableMinOrder(product.minOrderQuantity > 1);
      setExistingImages(product.image || []);
      
      if (product.quantityPriceList) {
        setEnableQuantityPriceList(true);
        
        // Check if quantityPriceList is already an object or a JSON string
        let parsedList;
        if (typeof product.quantityPriceList === 'string') {
          try {
            parsedList = JSON.parse(product.quantityPriceList);
          } catch (error) {
            console.error("Error parsing quantityPriceList:", error);
            parsedList = [];
          }
        } else if (Array.isArray(product.quantityPriceList)) {
          parsedList = product.quantityPriceList;
        } else {
          parsedList = [];
        }
        
        setQuantityPriceList(parsedList);
        setPrice("0");
      } else {
        setEnableQuantityPriceList(false);
      }
    }
  }, [editMode, product]);

  const handleImageChange = (e, position) => {
    const file = e.target.files[0];
    if (!file) return;
    
    switch (position) {
      case 1:
        setImage1(file);
        break;
      case 2:
        setImage2(file);
        break;
      case 3:
        setImage3(file);
        break;
      case 4:
        setImage4(file);
        break;
      default:
        break;
    }
    
    // Mark this position for replacement
    setImagesToReplace(prev => ({ ...prev, [position-1]: true }));
  };

  const handleQuantityPriceListToggle = (enabled) => {
    setEnableQuantityPriceList(enabled);
    if (enabled) {
      setPrice("0"); // Set price to 0 when enabling quantity price list
    }
  };

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
      // Validate quantity price list if enabled
      if (enableQuantityPriceList) {
        const hasEmptyValues = quantityPriceList.some(item => 
          !item.quantity.trim() || !item.price.trim()
        );
        if (hasEmptyValues) {
          toast.error("Please fill all quantity and price fields");
          return;
        }

        const sortedList = [...quantityPriceList].sort((a, b) => 
          parseInt(a.quantity) - parseInt(b.quantity)
        );
        setQuantityPriceList(sortedList);
      }

      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);

      if (enableMinOrder && minOrderQuantity && !enableQuantityPriceList) {
        formData.append("minOrderQuantity", minOrderQuantity);
      }

      if (enableQuantityPriceList) {
        formData.append("quantityPriceList", JSON.stringify(quantityPriceList));
      }

      if (editMode) {
        formData.append("id", product._id);
        
        // Send the existing images array and the positions to replace
        formData.append("existingImages", JSON.stringify(existingImages));
        formData.append("imagesToReplace", JSON.stringify(imagesToReplace));
      }

      // Only append images that are provided
      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      const toastId = toast.loading(editMode ? "Updating product..." : "Adding product...");

      const endpoint = editMode ? "/api/product/edit" : "/api/product/add";
      const response = await axios.post(
        backendUrl + endpoint,
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.update(toastId, {
          render: response.data.message,
          type: "success",
          isLoading: false,
          autoClose: 3000
        });

        if (editMode && onEditComplete) {
          onEditComplete();
        } else {
          // Reset form for add mode
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
        }
      } else {
        toast.update(toastId, {
          render: response.data.message,
          type: "error",
          isLoading: false,
          autoClose: 3000
        });
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
              className="w-25 h-25 object-cover"
              src={!image1 ? (editMode && existingImages[0] ? existingImages[0] : assets.upload_area) : URL.createObjectURL(image1)}
              alt=""
            />
            <input
              onChange={(e) => handleImageChange(e, 1)}
              type="file"
              id="image1"
              hidden
            />
          </label>

          <label htmlFor="image2">
            <img
              className="w-25 h-25 object-cover"
              src={!image2 ? (editMode && existingImages[1] ? existingImages[1] : assets.upload_area) : URL.createObjectURL(image2)}
              alt=""
            />
            <input
              onChange={(e) => handleImageChange(e, 2)}
              type="file"
              id="image2"
              hidden
            />
          </label>

          <label htmlFor="image3">
            <img
              className="w-25 h-25 object-cover"
              src={!image3 ? (editMode && existingImages[2] ? existingImages[2] : assets.upload_area) : URL.createObjectURL(image3)}
              alt=""
            />
            <input
              onChange={(e) => handleImageChange(e, 3)}
              type="file"
              id="image3"
              hidden
            />
          </label>

          <label htmlFor="image4">
            <img
              className="w-25 h-25 object-cover"
              src={!image4 ? (editMode && existingImages[3] ? existingImages[3] : assets.upload_area) : URL.createObjectURL(image4)}
              alt=""
            />
            <input
              onChange={(e) => handleImageChange(e, 4)}
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
            value={category?category:"None"}
          >
            <option value="None">None</option>
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
            value={subCategory?subCategory:"None"}
          >
            <option value="None">None</option>
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
            disabled={enableQuantityPriceList}
            title={enableQuantityPriceList ? "Price is managed through quantity price list" : ""}
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
          onChange={(e) => handleQuantityPriceListToggle(e.target.checked)}
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
        {editMode ? "UPDATE" : "ADD"}
      </button>
    </form>
  );
};

Add.propTypes = {
  token: PropTypes.string.isRequired,
  editMode: PropTypes.bool,
  product: PropTypes.object,
  onEditComplete: PropTypes.func
};

export default Add;
