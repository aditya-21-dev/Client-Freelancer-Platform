import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useContext } from 'react'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ChooseRole from './pages/auth/ChooseRole'
import ClientDashboard from './pages/client/ClientDashboard'
import FreelancerDashboard from './pages/freelancer/FreelancerDashboard'
import PostJob from './pages/client/PostJob'
import MyJobs from './pages/client/MyJobs'
import BrowseJobs from './pages/freelancer/BrowseJobs'
import JobDetails from './pages/common/JobDetails'
import ProjectDetails from './pages/common/ProjectDetails'
import MyProposals from './pages/freelancer/MyProposals'
import ProjectProposals from './pages/client/ProjectProposals'
import ProposalDetails from './pages/common/ProposalDetails'
import Messages from './pages/messages/Messages'
import SubmitProposal from './pages/freelancer/SubmitProposal'
import AllProposals from './pages/client/AllProposals'
import Transactions from './pages/client/Transactions'
import ActiveProjects from './pages/freelancer/ActiveProjects'
import Earnings from './pages/freelancer/Earnings'
import FreelancerProfile from './pages/freelancer/FreelancerProfile'
import ClientProfile from './pages/client/ClientProfile'
import Home from './pages/landing/Home'
import About from './pages/landing/About'
import Contact from './pages/landing/Contact'
import ProtectedRoute from './routes/ProtectedRoute'
import PublicRoute from './routes/PublicRoute'
import { AuthContext } from './context/AuthContext'

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-brand-background text-brand-text">
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)] w-full">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-5 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

const RoleDashboardRedirect = () => {
  const { user } = useContext(AuthContext)
  const target = user?.role === 'client' ? '/client/dashboard' : '/freelancer/dashboard'
  return <Navigate to={target} replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <RoleDashboardRedirect />
          </ProtectedRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/choose-role"
        element={
          <PublicRoute>
            <ChooseRole />
          </PublicRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/messages" element={<Messages />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/jobs/:id" element={<ProjectDetails />} />
        <Route path="/proposals/:id" element={<ProposalDetails />} />
      </Route>

      <Route
        path="/client"
        element={
          <ProtectedRoute role="client">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<ClientDashboard />} />
        <Route path="profile" element={<ClientProfile />} />
        <Route path="post-job" element={<PostJob />} />
        <Route path="my-jobs" element={<MyJobs />} />
        <Route path="proposals/:projectId" element={<ProjectProposals />} />
        <Route path="proposals" element={<AllProposals />} />
        <Route path="transactions" element={<Transactions />} />
      </Route>

      <Route
        path="/freelancer"
        element={
          <ProtectedRoute role="freelancer">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<FreelancerDashboard />} />
        <Route path="browse-jobs" element={<BrowseJobs />} />
        <Route path="my-proposals" element={<MyProposals />} />
        <Route path="proposal/:projectId" element={<SubmitProposal />} />
        <Route path="active-projects" element={<ActiveProjects />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="profile" element={<FreelancerProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
