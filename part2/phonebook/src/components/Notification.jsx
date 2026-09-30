const SuccessfulNotification = ({ message }) => {
  if (message === null) return null;

  return <div className="notification greenColor">{message}</div>;
};

export default SuccessfulNotification;
