import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const useCategories = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/categories");

      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories", error);
      // Set empty array as fallback
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return { loading, categories };
};

export default useCategories;
