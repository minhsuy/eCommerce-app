import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customerApi } from "../lib/api/admin";
import { formatDate } from "../utils/utils";
import { toast } from "react-toastify";
type Customer = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  imageUrl: string;
  addresses: {
    fullName: string;
  }[];
  wishlist: string[];
};

const CustomersPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: customerApi.getAll,
  });

  const queryClient = useQueryClient();

  const updateUserRoleMutation = useMutation({
    mutationFn: customerApi.updateRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const users: Customer[] = (data && data?.customers) || [];
  const handleChangeRole = async ({
    userId,
    role,
  }: {
    userId: string;
    role: string;
  }) => {
    await updateUserRoleMutation.mutateAsync({ userId, role });
    toast.success("Role updated successfully");
  };
  return (
    <div className="spacey-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-base-content/70 mt-1">
          {users.length} {users.length === 1 ? "customer" : "customers"}{" "}
          registered
        </p>
      </div>

      {/* CUSTOMERS TABLE */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-base-content/60">
              <p className="text-xl font-semibold mb-2">No customers yet</p>
              <p className="text-sm">
                Customers will appear here once they sign up
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Addresses</th>
                    <th>Wishlist</th>
                    <th>Joined Date</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((customer: Customer) => (
                    <tr key={customer._id}>
                      <td className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-primary text-primary-content rounded-full w-12">
                            <img
                              src={customer.imageUrl}
                              alt={customer.name}
                              className="w-12 h-12 rounded-full"
                            />
                          </div>
                        </div>
                        <div className="font-semibold">{customer.name}</div>
                      </td>

                      <td>{customer.email}</td>

                      <td>
                        <select
                          className="select select-bordered select-sm w-32"
                          defaultValue={customer.role}
                          onChange={(e) =>
                            handleChangeRole({
                              userId: customer._id,
                              role: e.target.value,
                            })
                          }
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>

                      <td>
                        <div className="badge badge-ghost">
                          {customer.addresses?.length || 0} address(es)
                        </div>
                      </td>

                      <td>
                        <div className="badge badge-ghost">
                          {customer.wishlist?.length || 0} item(s)
                        </div>
                      </td>

                      <td>
                        <span className="text-sm opacity-60">
                          {formatDate(customer.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
