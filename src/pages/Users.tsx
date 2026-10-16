import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, User, Wrench, Shield, Layers } from "lucide-react";

// Redux Imports
import type { AppDispatch, RootState } from "../store";
import {
  fetchUsers,
  fetchUserById,
  toggleUserStatus,
  clearSelectedUser,
} from "../store/slices/userSlice";

// Components
import { UserTable } from "../components/Users/UserTable";
import UserDetailModal from "../components/Users/UserDetailModal";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";

export const Users = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, selectedUser } = useSelector(
    (state: RootState) => state.users
  );

  const [activeRole, setActiveRole] = useState("CUSTOMER");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(
      fetchUsers({
        role: activeRole,
        search: searchTerm,
      })
    );
  }, [dispatch, activeRole, searchTerm]);

  const handleView = (id: number) => {
    dispatch(fetchUserById(id));
    setModalOpen(true);
  };

  const handleStatusToggle = async (id: number) => {
    await dispatch(toggleUserStatus(id));
    dispatch(fetchUsers({ role: activeRole, search: searchTerm }));
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    dispatch(clearSelectedUser());
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="default" className="text-xs font-bold uppercase tracking-wider">
              Identity & Access
            </Badge>
            <span className="text-xs font-medium text-muted-foreground">
              RBAC Directory
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            User Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Centralized directory for customers, registered mechanics, and administrator staff.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground rounded-full border border-border/80 bg-card/80 px-3.5 py-1.5 shadow-sm">
          <Layers className="h-4 w-4 text-primary" />
          <span>{users.length} Active in Role</span>
        </div>
      </div>

      {/* ================= MAIN CARD & TABS ================= */}
      <div className="rounded-2xl border border-border/70 bg-card/80 p-6 backdrop-blur-md shadow-sm space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Tabs
            value={activeRole}
            onValueChange={setActiveRole}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full grid-cols-3 sm:w-auto">
              <TabsTrigger value="CUSTOMER" className="gap-2 px-4">
                <User className="h-4 w-4" />
                <span>Customers</span>
              </TabsTrigger>
              <TabsTrigger value="MECHANIC" className="gap-2 px-4">
                <Wrench className="h-4 w-4" />
                <span>Mechanics</span>
              </TabsTrigger>
              <TabsTrigger value="STAFF" className="gap-2 px-4">
                <Shield className="h-4 w-4" />
                <span>Staff</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search user by name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-background/60"
            />
          </div>
        </div>

        {/* ================= USER TABLE ================= */}
        <div className="overflow-hidden rounded-xl border border-border/60">
          <UserTable
            users={users}
            loading={loading}
            onView={handleView}
            onToggleStatus={handleStatusToggle}
          />
        </div>
      </div>

      {/* ================= USER DETAIL MODAL ================= */}
      <UserDetailModal
        open={modalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
        loading={loading}
        onToggleStatus={handleStatusToggle}
      />
    </div>
  );
};

export default Users;
