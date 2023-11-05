import { Toast, ToasterToast } from "@/components/ui/toast/use-toast";


const addToastOnRequestCompletion = ({ errorMsg, successMsg, response, toast }: {
    errorMsg: string, successMsg: string, response: Response; toast: ({ ...props }: Toast) => {
        id: string;
        dismiss: () => void;
        update: (props: ToasterToast) => void;
    }
}): void => {
    if (response.status >= 400) {
        toast({
            variant: "destructive",
            title: "Error",
            description: errorMsg,
            duration: 5000,
        })

    } else {
        toast({
            title: "Success",
            description: successMsg,
            style: { backgroundColor: "#53A653" },
            duration: 5000,
        })
    }
}

export default addToastOnRequestCompletion