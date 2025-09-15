import { Link } from 'react-router-dom';

const UserTable = ({ users, onDelete }) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
          <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {users.map(user => (
          <tr key={user.id}>
            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.email}</td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.phone}</td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
              <Link to={`/edit-user/${user.id}`} className="text-indigo-600 hover:text-indigo-900">Edit</Link>
              <button onClick={() => onDelete(user.id)} className="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default UserTable;