import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup"
import toast from "react-hot-toast";
import { AuthContext } from '../../context/authContext';
import { deleteMessage, getMessagesByPet, postMessage, replyMessage } from '../../api';
import IMessageType from '../../types/messageType';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsReply } from 'react-icons/bs';

const schema = yup.object({
    message: yup.string().trim(),
    replyMessage: yup.string().trim(),
}).required();
type FormData = yup.InferType<typeof schema>;

const Messages = () => {
    const { user } = useContext(AuthContext);
    const { pid } = useParams();
    const [messages, setMessages] = useState<IMessageType[]>([]);
    const [removeMsg, setRemoveMsg] = useState({ isRemove: false, msgId: '' });
    const [replyMsg, setReplyMsg] = useState({ isReply: false, msgId: '' });

    const { register, handleSubmit, reset } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = handleSubmit(async data => {
        if (!data.message || !pid) return;
        const res = await postMessage(pid, data.message);

        if (res?.success) {
            reset({ message: "", replyMessage: "" });
            toast.success("Post message success.");
            fetchMessages(pid);
        }
    });

    const onReply = handleSubmit(async data => {
        if (!data.replyMessage || !replyMsg.msgId || !pid) return;
        const res = await replyMessage(replyMsg.msgId, data.replyMessage);

        if (res?.success) {
            reset({ message: "", replyMessage: "" });
            toast.success("Reply message success.");
            setReplyMsg({ isReply: false, msgId: "" });
            fetchMessages(pid);
        }
    });

    const fetchMessages = async (petId: string) => {
        const res = await getMessagesByPet(petId);
        if (res?.success) setMessages(res?.messages);
    }

    useEffect(() => {
        if (pid && user) fetchMessages(pid);
    }, [pid]);

    const onDelete = async () => {
        if (!removeMsg.msgId || !pid) return;

        const res = await deleteMessage(removeMsg.msgId);
        if (res?.success) {
            toast.success('Delete message success.');
            fetchMessages(pid);
            setRemoveMsg({ isRemove: false, msgId: '' });
        }
    }

    return (
        <div className='mt-10 bg-white p-8 rounded-xl divide-y-2'>
            <p>Messages</p>

            {messages.map(msg => (
                <div key={msg.id} className='py-4 relative'>
                    <div className="chat chat-start">
                        <div className="chat-header">
                            {msg.user}
                        </div>
                        <div className="chat-bubble chat-bubble-primary">{msg.message}</div>
                        <div className="chat-footer opacity-50">
                            {msg.createdAt}
                        </div>
                    </div>
                    {msg.replyMessage &&
                        <div className="chat chat-end">
                            <div className="chat-header">
                                Staff
                            </div>
                            <div className="chat-bubble chat-bubble-success">{msg.replyMessage}</div>
                            <div className="chat-footer opacity-50">
                                {msg.updatedAt}
                            </div>
                        </div>
                    }
                    {replyMsg.isReply &&
                        <div className='w-full flex pt-4'>
                            <input type="text" className='flex-1 input input-bordered mr-10' {...register("replyMessage")} />
                            <button className='btn btn-info w-32 mr-2' onClick={onReply}>reply</button>
                            <button className='btn btn-success w-32' onClick={() => setReplyMsg({ isReply: false, msgId: "" })}>cancel</button>
                        </div>
                    }
                    {user && user.role === 'staff' &&
                        <div className='absolute top-4 right-2 flex gap-7'>
                            <button onClick={() => setReplyMsg({ isReply: true, msgId: msg.id })}>
                                <BsReply className='text-success text-xl' />
                            </button>
                            <button onClick={() => setRemoveMsg({ isRemove: true, msgId: msg.id })}>
                                <AiOutlineDelete className='text-error text-xl' />
                            </button>
                        </div>
                    }
                </div>
            ))}

            {user &&
                <div className='w-full flex pt-4 gap-10'>
                    <input type="text" className='flex-1 input input-bordered' {...register("message")} />
                    <button className='btn btn-primary w-40' onClick={onSubmit}>send</button>
                </div>
            }

            {/* confirm delete modal */}
            {removeMsg.isRemove ?
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Confirm delete this message?</h3>
                        <div className="modal-action">
                            <button className="btn btn-error" onClick={() => onDelete()}>Confirm</button>
                            <button className="btn btn-success" onClick={() => setRemoveMsg({ isRemove: false, msgId: '' })}>Cancel</button>
                        </div>
                    </div>
                </div>
                : null
            }
        </div>
    )
}

export default Messages