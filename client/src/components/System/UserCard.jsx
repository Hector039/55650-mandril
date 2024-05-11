import User from "./User";

export default function UserCard({ users }) {

    return (
        <div className="product-main">
            {users.map((obj) => <User key={obj._id} user={obj} />)}
        </div>
    )
}
