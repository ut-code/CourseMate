import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function EditCourses() {
  const navigate = useNavigate();
  // const { data, loading, error } = hooks.useMe();

  const handleSave = () => {
    navigate("/settings"); // router.pushからnavigateに変更
  };

  const handleBack = () => {
    navigate("/edit/profile"); // router.pushからnavigateに変更
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: "350px", margin: "0 auto" }}>
      <h1>授業選択</h1>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "center",
        }}
      >
        <thead>
          <tr>
            <th>月</th>
            <th>火</th>
            <th>水</th>
            <th>木</th>
            <th>金</th>
            <th>土</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5, 6].map((row) => (
            <tr key={row}>
              {["月", "火", "水", "木", "金", "土"].map((day) => (
                <td
                  key={day}
                  style={{ border: "1px solid #ddd", height: "50px" }}
                >
                  {day === "火" && row === 3 ? "英語" : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        <Button variant="contained" onClick={handleBack}>
          戻る
        </Button>
        <Button variant="contained" onClick={handleSave}>
          登録
        </Button>
      </Box>
    </Box>
  );
}
