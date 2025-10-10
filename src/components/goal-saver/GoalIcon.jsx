import { FaSchool, FaStore, FaBullseye } from "react-icons/fa";

const GoalIcon = ({ icon, className }) => {
  switch (icon) {
    case "school":
      return <FaSchool className={className} />;
    case "store":
      return <FaStore className={className} />;
    default:
      return <FaBullseye className={className} />;
  }
};

export default GoalIcon;
