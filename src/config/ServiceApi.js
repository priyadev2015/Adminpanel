module.exports = {
  baseURL: "https://propertymanagement-nf5c.onrender.com/api",
  authLogin: "/auth/login",
  roleCreate: "/roles",
  propertiesCount: "/properties/count",
  expiredLease: "/leases/expired/count",
  nonexpiredLease: "/leases/non-expired/count",
  totalCounts: "/tenants/count",
  propertiesList: "/properties",
  leaseExpred: "/leases/all",
  tenantlist: "/tenant-requests/tenant-list",
  tenantpropertyapprovedbyowner: "/tenant-requests/approved-owner-list",
  tenantrequest: "/tenant-requests",
  users: "/auth/users", // Fetch users
  roles: "/roles", // Fetch roles
  createUser: "/auth/register", 
  messageList:"/tenant-requests/owners-and-tenants",
  receivedMessages: "/messages/received", // Endpoint for received messages
  sentMessages: "/messages/recipient",
  graphoccupancy:"/properties/occupancy/daily",
  graphsquarefootage:"/properties/squarefootage/daily"

};
