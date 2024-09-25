import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import hooks from "../api/hooks";
import { update } from "../api/user";
import {
  PhotoPreview,
  PhotoPreviewButton,
} from "../components/config/PhotoPreview";
import UserAvatar from "../components/human/avatar";
import { uploadImage } from "../firebase/store/photo";
import { facultiesAndDepartments } from "./registration/data";

export default function EditProfile() {
  const navigate = useNavigate();
  const { data, loading, error } = hooks.useMe();

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [grade, setGrade] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [intro, setIntro] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [tmpName, setTmpName] = useState("");
  const [tmpGender, setTmpGender] = useState("");
  const [tmpGrade, setTmpGrade] = useState("");
  const [tmpFaculty, setTmpFaculty] = useState("");
  const [tmpDepartment, setTmpDepartment] = useState("");
  const [tmpIntro, setTmpIntro] = useState("");

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingGender, setIsEditingGender] = useState(false);
  const [isEditingGrade, setIsEditingGrade] = useState(false);
  const [isEditingFaculty, setIsEditingFaculty] = useState(false);
  const [isEditingDepartment, setIsEditingDepartment] = useState(false);
  const [isEditingIntro, setIsEditingIntro] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [file, setFile] = useState<File>();

  useEffect(() => {
    if (data) {
      setName(data.name);
      setGender(data.gender);
      setGrade(data.grade);
      setFaculty(data.faculty);
      setDepartment(data.department);
      setIntro(data.intro);
      setPictureUrl(data.pictureUrl);
      setTmpName(data.name);
      setTmpGender(data.gender);
      setTmpGrade(data.grade);
      setTmpFaculty(data.faculty);
      setTmpDepartment(data.department);
      setTmpIntro(data.intro);
    }
  }, [data]);

  async function select() {
    try {
      if (!file) throw new Error("画像は入力必須です");
      const url = await uploadImage(file);
      setPictureUrl(url);
    } catch (error) {
      if (error instanceof Error) {
        let errorMessages: string;
        try {
          const parsedError = JSON.parse(error.message);
          if (Array.isArray(parsedError)) {
            errorMessages = parsedError.map((err) => err.message).join(", ");
          } else {
            errorMessages = error.message;
          }
        } catch {
          errorMessages = error.message;
        }

        // エラーメッセージをセット
        setErrorMessage(errorMessages);
      } else {
        console.log("unknown error:", error);
        setErrorMessage("入力に誤りがあります。");
      }
    }
  }

  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    console.log("open: ", open);
  }, [open]);

  const handleGoToCourses = () => {
    navigate("/edit/courses");
  };

  async function handleSave() {
    await update({
      name: name,
      gender: gender,
      grade: grade,
      faculty: faculty,
      department: department,
      intro: intro,
      pictureUrl: pictureUrl,
    });
  }

  function handleEdit(setter: React.Dispatch<React.SetStateAction<boolean>>) {
    setTmpName(name);
    setTmpGender(gender);
    setTmpGrade(grade);
    setTmpFaculty(faculty);
    setTmpDepartment(department);
    setTmpIntro(intro);
    setIsEditingName(false);
    setIsEditingGender(false);
    setIsEditingGrade(false);
    setIsEditingFaculty(false);
    setIsEditingDepartment(false);
    setIsEditingIntro(false);
    setter(true);
  }

  const handleBack = () => {
    navigate("/settings");
    handleSave();
  };

  const handleFacultyChange = (event: SelectChangeEvent<string>) => {
    setTmpFaculty(event.target.value);
  };

  const handleDepartmentChange = (event: SelectChangeEvent<string>) => {
    setTmpDepartment(event.target.value);
  };

  return (
    <Box sx={{ padding: "20px" }}>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : data ? (
        <Box mt={2} mx={2} display="flex" flexDirection="column" gap={2}>
          <Typography>プロフィール編集</Typography>
          <FormControl>
            <Box display="flex" alignItems="center">
              <TextField
                value={tmpName}
                onChange={(e) => setTmpName(e.target.value)}
                label="名前"
                disabled={!isEditingName}
                fullWidth
              />

              <IconButton
                onClick={() => {
                  if (isEditingName) {
                    setName(tmpName);
                    handleSave();
                    setIsEditingName(false);
                  } else {
                    handleEdit(setIsEditingName);
                  }
                }}
              >
                {isEditingName ? (
                  <Typography color={"primary"}>保存</Typography>
                ) : (
                  <EditIcon style={{ fontSize: "32px" }} />
                )}
              </IconButton>
            </Box>
          </FormControl>

          <FormControl>
            <Box display="flex" alignItems="center">
              <InputLabel>性別</InputLabel>
              <Select
                value={tmpGender}
                label="性別"
                onChange={(e) => setTmpGender(e.target.value)}
                disabled={!isEditingGender}
                fullWidth
              >
                <MenuItem value={"男性"}>男性</MenuItem>
                <MenuItem value={"女性"}>女性</MenuItem>
                <MenuItem value={"その他"}>その他</MenuItem>
                <MenuItem value={"秘密"}>秘密</MenuItem>
              </Select>
              <IconButton
                onClick={() => {
                  if (isEditingGender) {
                    setGender(tmpGender);
                    handleSave();
                    setIsEditingGender(false);
                  } else {
                    handleEdit(setIsEditingGender);
                  }
                }}
              >
                {isEditingGender ? (
                  <Typography color={"primary"}>保存</Typography>
                ) : (
                  <EditIcon style={{ fontSize: "32px" }} />
                )}
              </IconButton>
            </Box>
          </FormControl>

          <FormControl>
            <Box display="flex" alignItems="center">
              <InputLabel>学年</InputLabel>
              <Select
                value={tmpGrade}
                label="学年"
                onChange={(e) => setTmpGrade(e.target.value)}
                disabled={!isEditingGrade}
                fullWidth
              >
                <MenuItem value={"B1"}>1年生 (B1)</MenuItem>
                <MenuItem value={"B2"}>2年生 (B2)</MenuItem>
                <MenuItem value={"B3"}>3年生 (B3)</MenuItem>
                <MenuItem value={"B4"}>4年生 (B4)</MenuItem>
                <MenuItem value={"M1"}>修士1年 (M1)</MenuItem>
                <MenuItem value={"M2"}>修士2年 (M2)</MenuItem>
              </Select>
              <IconButton
                onClick={() => {
                  if (isEditingGrade) {
                    setGrade(tmpGrade);
                    handleSave();
                    setIsEditingGrade(false);
                  } else {
                    handleEdit(setIsEditingGrade);
                  }
                }}
              >
                {isEditingGrade ? (
                  <Typography color={"primary"}>保存</Typography>
                ) : (
                  <EditIcon style={{ fontSize: "32px" }} />
                )}
              </IconButton>
            </Box>
          </FormControl>

          <FormControl>
            <Box display="flex" alignItems="center">
              <InputLabel>学部</InputLabel>
              <Select
                value={tmpFaculty}
                label="学部"
                onChange={handleFacultyChange}
                disabled={!isEditingFaculty}
                fullWidth
              >
                {Object.keys(facultiesAndDepartments).map((fac) => (
                  <MenuItem key={fac} value={fac}>
                    {fac}
                  </MenuItem>
                ))}
              </Select>
              <IconButton
                onClick={() => {
                  if (isEditingFaculty) {
                    setDepartment("");
                    setFaculty(tmpFaculty);
                    handleSave();
                    setIsEditingFaculty(false);
                  } else {
                    handleEdit(setIsEditingFaculty);
                  }
                }}
              >
                {isEditingFaculty ? (
                  <Typography color={"primary"}>保存</Typography>
                ) : (
                  <EditIcon style={{ fontSize: "32px" }} />
                )}
              </IconButton>
            </Box>
          </FormControl>

          <FormControl>
            <Box display="flex" alignItems="center">
              <InputLabel>学科</InputLabel>
              <Select
                value={tmpDepartment}
                onChange={handleDepartmentChange}
                disabled={!isEditingDepartment || !faculty}
                label="学科"
                fullWidth
              >
                {faculty &&
                  facultiesAndDepartments[faculty].map((dep) => (
                    <MenuItem key={dep} value={dep}>
                      {dep}
                    </MenuItem>
                  ))}
              </Select>
              <IconButton
                onClick={() => {
                  if (isEditingDepartment) {
                    setDepartment(tmpDepartment);
                    handleSave();
                    setIsEditingDepartment(false);
                  } else {
                    handleEdit(setIsEditingDepartment);
                  }
                }}
              >
                {isEditingDepartment ? (
                  <Typography color={"primary"}>保存</Typography>
                ) : (
                  <EditIcon style={{ fontSize: "32px" }} />
                )}
              </IconButton>
            </Box>
          </FormControl>

          <FormControl>
            <Box display="flex" alignItems="center" justifyContent={"space-"}>
              <TextField
                multiline
                minRows={3}
                value={tmpIntro}
                onChange={(e) => setTmpIntro(e.target.value)}
                label="自己紹介"
                disabled={!isEditingIntro}
                fullWidth
              />
              <IconButton
                onClick={() => {
                  if (isEditingIntro) {
                    setIntro(tmpIntro);
                    handleSave();
                    setIsEditingIntro(false);
                  } else {
                    handleEdit(setIsEditingIntro);
                  }
                }}
              >
                {isEditingIntro ? (
                  <Typography color={"primary"}>保存</Typography>
                ) : (
                  <EditIcon style={{ fontSize: "32px" }} />
                )}
              </IconButton>
            </Box>
          </FormControl>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Modal
              id="MODAL"
              open={true}
              sx={{
                visibility: open ? "visible" : "hidden",
                Margin: "auto",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
              }}
            >
              <Box
                style={{
                  backgroundColor: "white",
                  width: "90%",
                  height: "auto",
                  padding: "20px",
                }}
              >
                <PhotoPreview
                  prev={pictureUrl}
                  onCrop={(f) => {
                    setFile(f);
                  }}
                />
                <Button
                  sx={{ float: "right", marginRight: "30px" }}
                  onClick={async () => {
                    await select();
                    await handleSave();

                    setOpen(false);
                  }}
                >
                  切り取って保存
                </Button>
              </Box>
            </Modal>
            <div style={{ textAlign: "left" }}>
              <Typography variant="h6">プロフィール画像</Typography>
            </div>
            <div
              style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <div style={{ margin: "auto" }}>
                <UserAvatar
                  width="300px"
                  height="300px"
                  pictureUrl={pictureUrl}
                />
              </div>
              <PhotoPreviewButton
                text="写真を選択"
                onSelect={() => setOpen(true)}
              />

              {errorMessage && <span>{errorMessage}</span>}
            </div>
          </div>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "40px",
            }}
          >
            <Button
              onClick={handleBack}
              style={{
                borderRadius: "25px",
                width: "35vw",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              }}
            >
              設定画面に戻る
            </Button>
            <Button
              variant="contained"
              onClick={handleGoToCourses}
              style={{
                borderRadius: "25px",
                width: "35vw",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              }}
            >
              授業編集へ
            </Button>
          </Box>
        </Box>
      ) : (
        <p>データがありません。</p>
      )}
    </Box>
  );
}
