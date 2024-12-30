// src/icons.js
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'; // Import PersonAddAltIcon
import MessageIcon from '@mui/icons-material/Message'; // Import MessageIcon
import ViewListIcon from '@mui/icons-material/ViewList'; // Import ViewListIcon

export const getIconForText = (text) => {
  switch (text) {
    case 'Roles':
      return <PersonAddAltIcon />; // Use PersonAddAltIcon for RoleCreate
    case 'User Maagement':
      return <PeopleIcon />; // Use PeopleIcon for UserManagement
    case 'Message':
      return <MessageIcon />; // Use MessageIcon for Message
    case 'Properties':
      return <ViewListIcon />; // Use ViewListIcon for PropertiesList
    case 'Property Alloted':
      return <InboxIcon />; // Use InboxIcon for PropertyAllotedList
    case 'Lease':
      return <InboxIcon />; // Use InboxIcon for LeaseExpired
    case 'Tenant Request':
      return <MailIcon />; // Use MailIcon for TenantRequest
    case 'OwnerList':
      return <PeopleIcon />; // Use PeopleIcon for OwnerList
    case 'TenantList':
      return <PeopleIcon />; // Use PeopleIcon for TenantList
    case 'MaintenanceList':
      return <AssignmentIcon />; // Use AssignmentIcon for MaintenanceList
    default:
      return <MailIcon />; // Default icon
  }
};
