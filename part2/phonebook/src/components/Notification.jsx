const Notification = ({ notificationMessage }) => {
  if (notificationMessage.message === null) return null;
  const color = notificationMessage.isError ? `redColor` : `greenColor`;
  console.log(color, notificationMessage.isError);

  return (
    <div className={`notification ${color}`}>{notificationMessage.message}</div>
  );
};

export default Notification;
