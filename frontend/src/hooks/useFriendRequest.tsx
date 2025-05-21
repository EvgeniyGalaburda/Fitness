import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios";
import toast from "react-hot-toast";

export const useFriendRequest = () => {
    const queryClient = useQueryClient();

    const {mutate} = useMutation({
        mutationKey: ['sendFriendRequest'],
        mutationFn: async ({id}: {id: string}) => {
            const res = await axios.post('http://localhost:5000/api/user/friend-request', {id}, {withCredentials:true} );
            return res.data
        },
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({queryKey: ['someUser']});
            await queryClient.invalidateQueries({queryKey: ['authUser']});
            toast.success(data.message)
        },
        onError: (err: any) => {
            toast.error(err.response.data.message)
        }
    })

    return mutate;
}