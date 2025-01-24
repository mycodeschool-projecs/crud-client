
interface PostMessProps {
    sendMessage: (message: string) => void;
}

const PostMess: React.FC<PostMessProps> = ({ sendMessage }) => {
    const handleSend = () => {
        sendMessage('Hello!');
    };

    return (
        <div>
            <button onClick={handleSend}>Send "Hello!"</button>
        </div>
    );
};

export default PostMess;