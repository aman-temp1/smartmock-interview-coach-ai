
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to Dashboard since we're using that as our main page now
    navigate("/");
  }, [navigate]);

  return null;
};

export default Index;
