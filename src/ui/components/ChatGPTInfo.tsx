export default function ChatGPTInfo({content}: {content:string}){
    return (
        <>
            <h2>Quick Summary:</h2>
            <div>
                <p>{content}</p>
            </div>
        </>

    );
}