import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'
import Home from '../pages/landing/Home'
import About from '../pages/landing/About'
import Contact from '../pages/landing/Contact'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ChooseRole from '../pages/auth/ChooseRole'
import ClientDashboard from '../pages/client/ClientDashboard'
import FreelancerDashboard from '../pages/freelancer/FreelancerDashboard'
import PostJob from '../pages/client/PostJob'
import MyJobs from '../pages/client/MyJobs'
import BrowseJobs from '../pages/freelancer/BrowseJobs'
import JobDetails from '../pages/common/JobDetails'
import ProjectDetails from '../pages/common/ProjectDetails'
import MyProposals from '../pages/freelancer/MyProposals'
import ProjectProposals from '../pages/client/ProjectProposals'
import ProposalDetails from '../pages/common/ProposalDetails'
import Messages from '../pages/messages/Messages'
import PublicRoute from './PublicRoute'
import SubmitProposal from '../pages/freelancer/SubmitProposal'
import AllProposals from '../pages/client/AllProposals'
import Transactions from '../pages/client/Transactions'
import ActiveProjects from '../pages/freelancer/ActiveProjects'
import Earnings from '../pages/freelancer/Earnings'
import FreelancerProfile from '../pages/freelancer/FreelancerProfile'
import ClientProfile from '../pages/client/ClientProfile'

const ProtectedRoute = ({ requiredRole }) => {
  const { user } = useContext(AuthContext)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-brand-background text-brand-text">
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)] w-full">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 md:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/choose-role" element={<ChooseRole />} />
      </Route>

      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/messages" element={<Messages />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/jobs/:id" element={<ProjectDetails />} />
          <Route path="/proposals/:id" element={<ProposalDetails />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute requiredRole="client" />}>
        <Route element={<DashboardLayout />}>
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/client/profile" element={<ClientProfile />} />
          <Route path="/client/post-job" element={<PostJob />} />
          <Route path="/client/my-jobs" element={<MyJobs />} />
          <Route path="/client/proposals/:projectId" element={<ProjectProposals />} />
          <Route path="/client/proposals" element={<AllProposals />} />
          <Route path="/client/transactions" element={<Transactions />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute requiredRole="freelancer" />}>
        <Route element={<DashboardLayout />}>
          <Route path="/freelancer/dashboard" element={<FreelancerDashboard />} />
          <Route path="/freelancer/browse-jobs" element={<BrowseJobs />} />
          <Route path="/freelancer/my-proposals" element={<MyProposals />} />
          <Route path="/freelancer/proposal/:projectId" element={<SubmitProposal />} />
          <Route path="/freelancer/active-projects" element={<ActiveProjects />} />
          <Route path="/freelancer/earnings" element={<Earnings />} />
          <Route path="/freelancer/profile" element={<FreelancerProfile />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes

