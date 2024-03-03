import { Dispatch, FC, SetStateAction, useState } from "react";
import AuthStepOne from "./AuthStepOne";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import AuthStepTwo from "./AuthStepTwo";

interface AdminAuthProps {
  setAuth: Dispatch<SetStateAction<boolean>>;
}

const AdminAuth: FC<AdminAuthProps> = (props) => {
  const { setAuth } = props;
  const [authStep, setAuthStep] = useState(1);
  const [authData, setAuthData] = useState<{
    adminID: string;
    codeID: string;
  } | null>(null);

  return (
    <div className="w-[500px] h-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow bg-white rounded">
      <div className="border-b px-6 py-2 flex items-center justify-between">
        {authStep === 2 && (
          <span onClick={() => setAuthStep(1)}>
            <ArrowUturnLeftIcon className="w-6 h-6 text-gray-400 hover:text-rose-400 transition-colors cursor-pointer hover:animate-pulse" />
          </span>
        )}
        <h1 className="font-medium text-center text-lg">Вхід</h1>
      </div>
      {authStep === 1 && (
        <AuthStepOne setStep={setAuthStep} setAuthData={setAuthData} />
      )}
      {authStep === 2 && <AuthStepTwo authData={authData} setAuth={setAuth} />}
    </div>
  );
};

export default AdminAuth;
