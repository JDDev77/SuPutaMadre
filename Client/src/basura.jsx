import useAuth from "../../hooks/useAuth";
import avatar from "../../assets/img/user.png";
import Global from "../../helpers/Global";
import { Link } from "react-router-dom";
import ReactTimeAgo from 'react-time-ago';

export const UserList = ({ users, getUsers, following, setFollowing }) => {
    const { auth } = useAuth();

    const follow = async (userId) => {
        const request = await fetch(Global.url + 'follow/save', {
            method: "POST",
            body: JSON.stringify({ followed: userId }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });
        const data = await request.json();
        if (data.status === "success") {
            setFollowing([...following, userId]);
        }
    };

    const unfollow = async (userId) => {
        const request = await fetch(Global.url + 'follow/unfollow/' + userId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });
        const data = await request.json();
        if (data.status === "success") {
            const filterFollowings = following.filter(followingUserId => userId !== followingUserId);
            setFollowing(filterFollowings);
        }
    };

    return (
        <div className="content__posts">
            {users.map(user => (
                <article className="posts__post" key={user.id}>
                    <div className="post__container">
                        <div className="post__image-user">
                            <Link to={"/social/perfil/" + user._id} className="post__image-link">
                                {user.image !== "default.png" ? 
                                    <img src={Global.url + "user/avatar/" + user.image} className="post__user-image" alt="Foto de perfil" /> : 
                                    <img src={avatar} className="post__user-image" alt="Foto de perfil" />}
                            </Link>
                        </div>
                        <div className="post__body">
                            <div className="post__user-info">
                                <Link to={"/social/perfil/" + user._id} className="user-info__name">
                                    {user.name} {user.surname}
                                </Link>
                                <span className="user-info__divider"> | </span>
                                <Link to={"/social/perfil/" + user._id} className="user-info__create-date">
                                    <ReactTimeAgo date={user.created_at} locale="es-ES"/>
                                </Link>
                            </div>
                            <h4 className="post__content">{user.bio}</h4>
                        </div>
                        <div className="post__buttons">
                            <Link to={`/admin/usuarios/detalle/${user._id}`} className="post__button post__button--details">
                                Ver Detalles
                            </Link>
                            {user._id !== auth._id && (
                                <>
                                    {!following.includes(user._id) ? (
                                        <button className="post__button post__button--green" onClick={() => follow(user._id)}>
                                            Seguir
                                        </button>
                                    ) : (
                                        <button className="post__button" onClick={() => unfollow(user._id)}>
                                            Dejar de seguir
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
};
