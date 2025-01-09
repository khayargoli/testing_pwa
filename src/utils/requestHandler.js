

export const requestHandler = async (request, onSuccess, onError, setLoader) => {
    try {
        if (setLoader) setLoader(true);
        const response = await request();
        const { data } = response;

        if (onSuccess) onSuccess(data);
    }
    catch (error) {
        console.warn(error);
        console.warn("requestHandler error :: ", error?.message || error?.response?.data?.message);

        let errorMessage = error?.message || error?.response?.data.messge || "Something went wrong";
        let errorCode = error?.response?.status || error?.response?.data?.status_code;

        // if (errorCode == 401) {
        //     errorMessage = "Session Expired Please Refresh the Page for a new Session.";
        // }

        console.log("err details :: ", { errorCode, errorMessage });
        if (onError) onError(errorMessage, errorCode);
    }
    finally {
        if (setLoader) setLoader(false);
    }
};