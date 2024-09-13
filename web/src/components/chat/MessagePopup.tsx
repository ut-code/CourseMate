import ActionPopup from "../common/ActionPopup";

type Props = {
  handleEdit: () => void;
  handleDelete: () => void;
};
export default function MessagePopup(props: Props) {
  const { handleEdit, handleDelete } = props;
  const actions = [
    {
      label: "編集",
      onClick: handleEdit,
    },
    {
      label: "削除",
      onClick: handleDelete,
      confirmMessage: "メッセージを消去しますか？",
    },
  ];

  return <ActionPopup actions={actions} />;
}
