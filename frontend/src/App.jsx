import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home/Home";
import SignUp from "./pages/SignUp/SignUp";
import Login from "./pages/Login/Login";
import Contact from "./pages/Contact/Contact";
import About from "./pages/About/About";
import ApplyInstructor from "./pages/ApplyInstructor/ApplyInstructor";
import RegisterGym from "./pages/RegisterGym/RegisterGym";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Instructors from "./pages/admin/Instructors";
import Users from "./pages/admin/Users";
import GymOwners from "./pages/admin/GymOwners";
import Customers from "./pages/admin/Customers";
import Receptionists from "./pages/admin/Receptionists";
import FindGym from "./pages/FindGym";
import ClassSchedule from "./pages/ClassSchedule";
import BookingConfirmation from "./pages/BookingConfirmation";
import GymRegistration from "./pages/GymRegistration";
import CustomerProfile from "./pages/CustomerProfile";
import CustomerWorkouts from "./pages/Workouts";

// Gym Owner Routes
import GymOwnerLayout from "./layouts/GymOwnerLayout";
import GymOwnerDashboard from "./pages/gymowner/Dashboard";
import GymOwnerInstructors from "./pages/gymowner/Instructors";
import GymOwnerClasses from "./pages/gymowner/Classes";
import GymOwnerMembers from "./pages/gymowner/Members";
import GymOwnerSettings from "./pages/gymowner/Settings";
import AddInstructor from "./pages/gymowner/AddInstructor";
import VerifyRejectInstructor from "./pages/gymowner/VerifyRejectInstructor";

// Instructor Routes
import InstructorLayout from "./layouts/InstructorLayout";
import InstructorDashboard from "./pages/instructor/Dashboard";
import InstructorClasses from "./pages/instructor/Classes";
import InstructorStudents from "./pages/instructor/Students";
import InstructorSchedule from "./pages/instructor/Schedule";
import InstructorSettings from "./pages/instructor/Settings";
import Profile from "./pages/Profile";
import WorkoutPlans from "./pages/instructor/WorkoutPlans";
import CreateWorkoutPlan from "./pages/instructor/CreateWorkoutPlan";
import ViewMyWorkout from "./pages/ViewMyWorkout";
import InstructorApplications from "./pages/admin/InstructorApplications";
import VerifiedInstructors from "./pages/admin/VerifiedInstructors";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Pricing from "./pages/admin/Pricing";
import ViewProgress from "./pages/instructor/ViewProgress";
import ApplyToGym from "./pages/instructor/ApplyToGym";


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isGymOwnerRoute = location.pathname.startsWith("/gym-owner");
  const isInstructorRoute = location.pathname.startsWith("/instructor");
  const isCustomerRoute = location.pathname.startsWith("/customer");

    const isDashboardRoute =
      isAdminRoute || isGymOwnerRoute || isInstructorRoute || isCustomerRoute;


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="instructors" element={<Instructors />} />
          <Route path="users" element={<Users />} />
          <Route path="users/gym-owners" element={<GymOwners />} />
          <Route path="users/customers" element={<Customers />} />
          <Route path="users/receptionists" element={<Receptionists />} />
          <Route path="profile" element={<Profile />} />
          <Route path="payments" element={<Pricing />} />
          <Route
            path="instructor-applications"
            element={<InstructorApplications />}
          />
          <Route
            path="verified-instructors"
            element={<VerifiedInstructors />}
          />
        </Route>

        {/* Gym Owner Routes */}
        <Route path="/gym-owner" element={<GymOwnerLayout />}>
          <Route index element={<GymOwnerDashboard />} />
          <Route path="instructors" element={<GymOwnerInstructors />} />
          <Route path="classes" element={<GymOwnerClasses />} />
          <Route path="members" element={<GymOwnerMembers />} />
          <Route path="settings" element={<GymOwnerSettings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="addInstructor" element={<AddInstructor />} />
          <Route
            path="verify-reject-instructor"
            element={<VerifyRejectInstructor />}
          />
        </Route>

        {/* Instructor Routes */}
        <Route path="/instructor" element={<InstructorLayout />}>
          <Route index element={<InstructorDashboard />} />
          <Route path="classes" element={<InstructorClasses />} />
          <Route path="students" element={<InstructorStudents />} />
          <Route
            path="students/:studentId/progress"
            element={<ViewProgress />}
          />

          <Route path="schedule" element={<InstructorSchedule />} />
          <Route path="settings" element={<InstructorSettings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="workout-plans" element={<WorkoutPlans />} />
          <Route path="workout-plans/create" element={<CreateWorkoutPlan />} />
          <Route path="apply-to-gym" element={<ApplyToGym />} />
        </Route>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/apply-instructor" element={<ApplyInstructor />} />
        <Route path="/register-gym" element={<RegisterGym />} />
        <Route path="/find-gym" element={<FindGym />} />
        <Route path="/classes" element={<ClassSchedule />} />
        <Route path="/book-class/:classId" element={<BookingConfirmation />} />
        <Route path="/register-gym/:gymId" element={<GymRegistration />} />
        <Route path="/profile" element={<CustomerProfile />} />
        <Route path="/workouts" element={<CustomerWorkouts />} />
        <Route path="/view-my-workout" element={<ViewMyWorkout />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>

      {!isDashboardRoute && <Footer />}
    </div>
  );
}

export default App;
