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
    case 'RoleCreate':
      return <PersonAddAltIcon />; // Use PersonAddAltIcon for RoleCreate
    case 'UserManagement':
      return <PeopleIcon />; // Use PeopleIcon for UserManagement
    case 'Message':
      return <MessageIcon />; // Use MessageIcon for Message
    case 'PropertiesList':
      return <ViewListIcon />; // Use ViewListIcon for PropertiesList
    case 'PropertyAllotedList':
      return <InboxIcon />; // Use InboxIcon for PropertyAllotedList
    case 'LeaseExpired':
      return <InboxIcon />; // Use InboxIcon for LeaseExpired
    case 'TenantRequest':
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
