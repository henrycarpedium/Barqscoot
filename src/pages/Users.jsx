// src/pages/Users.jsx
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import UserList from "../components/users/UserList";
import UserDetails from "../components/users/UserDetails";
import UserForm from "../components/users/UserForm";
import UserEditModal from "../components/users/UserEditModal";
import { authService } from "../services/api";

const Users = () => {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEditInModal, setUserToEditInModal] = useState(null);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleBackFromUserDetails = () => {
    // Invalidate users query to refresh the list when returning from details
    queryClient.invalidateQueries(["users"]);
    setSelectedUser(null);
  };

  const handleAddUser = () => {
    setUserToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user) => {
    setUserToEdit(user);
    setIsFormOpen(true);
  };

  const handleEditUserInModal = (user) => {
    setUserToEditInModal(user);
    setIsEditModalOpen(true);
  };

  const handleEditModalSave = async (updatedUser) => {
    try {
      // Update local mock data for demo
      const getMockUsers = () => {
        const stored = localStorage.getItem('mockUsers');
        return stored ? JSON.parse(stored) : [];
      };

      const saveMockUsers = (users) => {
        localStorage.setItem('mockUsers', JSON.stringify(users));
      };

      const currentUsers = getMockUsers();
      const updatedUsers = currentUsers.map(u =>
        (u.id === updatedUser.id || u._id === updatedUser._id)
          ? { ...u, ...updatedUser }
          : u
      );
      saveMockUsers(updatedUsers);

      // Try to update user via API as well
      try {
        await authService.updateUser(updatedUser._id || updatedUser.id, updatedUser);
      } catch (apiError) {
        console.log('API call failed, but local state updated for demo');
      }

      // Invalidate and refetch users
      queryClient.invalidateQueries("users");

      // Close modal
      setIsEditModalOpen(false);
      setUserToEditInModal(null);

      // Show success message
      alert('User updated successfully!');
    } catch (error) {
      console.error("Error updating user:", error);
      alert('Failed to update user. Please try again.');
    }
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setUserToEditInModal(null);
  };

  const handleFormSubmit = async (userData) => {
    try {
      // Helper functions for local data management
      const getMockUsers = () => {
        const stored = localStorage.getItem('mockUsers');
        return stored ? JSON.parse(stored) : [];
      };

      const saveMockUsers = (users) => {
        localStorage.setItem('mockUsers', JSON.stringify(users));
      };

      if (userToEdit) {
        // Update existing user
        const currentUsers = getMockUsers();
        const updatedUsers = currentUsers.map(u =>
          (u.id === userToEdit.id || u._id === userToEdit._id)
            ? { ...u, ...userData }
            : u
        );
        saveMockUsers(updatedUsers);

        // Try API call as well
        try {
          await authService.updateUser(userToEdit._id || userToEdit.id, userData);
        } catch (apiError) {
          console.log('API call failed, but local state updated for demo');
        }
      } else {
        // Create new user
        const currentUsers = getMockUsers();
        const newUser = {
          ...userData,
          id: userData.id || `user_${Date.now()}`,
          _id: userData._id || `user_${Date.now()}`,
        };
        const updatedUsers = [...currentUsers, newUser];
        saveMockUsers(updatedUsers);

        // Try API call as well
        try {
          await authService.createUser(userData);
        } catch (apiError) {
          console.log('API call failed, but local state updated for demo');
        }
      }

      // Invalidate and refetch users
      queryClient.invalidateQueries("users");
      setIsFormOpen(false);
      setUserToEdit(null);

      // Show success message
      alert(userToEdit ? 'User updated successfully!' : 'User created successfully!');
    } catch (error) {
      console.error("Error submitting user form:", error);
      alert('Failed to save user. Please try again.');
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setUserToEdit(null);
  };

  return (
    <div className="space-y-6">
      {selectedUser ? (
        <UserDetails
          user={selectedUser}
          onBack={handleBackFromUserDetails}
          onEditUser={handleEditUserInModal}
        />
      ) : (
        <UserList
          onUserSelect={handleUserSelect}
          onAddUser={handleAddUser}
          onEditUser={handleEditUser}
        />
      )}

      <AnimatePresence>
        {isFormOpen && (
          <UserForm
            user={userToEdit}
            onClose={handleFormClose}
            onSubmit={handleFormSubmit}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditModalOpen && (
          <UserEditModal
            user={userToEditInModal}
            isOpen={isEditModalOpen}
            onClose={handleEditModalClose}
            onSave={handleEditModalSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Users;
