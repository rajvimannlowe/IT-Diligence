import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_CATEGORY_ID } from "@/data/dueDiligenceCategories";

const AssessmentQuestions = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/assessment/${DEFAULT_CATEGORY_ID}`, { replace: true });
  }, [navigate]);

  return null;
};

export default AssessmentQuestions;
