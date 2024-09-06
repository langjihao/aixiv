import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import "./home.css";
import HomePage from './home/page';

const MainPage: React.FC = () => {
  return <HomePage />;
};

export default MainPage;
