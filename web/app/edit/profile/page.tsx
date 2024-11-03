"use client";

import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { update, useAboutMe } from "../../../api/user";
import type { UpdateUser } from "../../../common/types";
import { UpdateUserSchema } from "../../../common/zod/schemas";
import FullScreenCircularProgress from "../../../components/common/FullScreenCircularProgress";
import { NavigateByAuthState } from "../../../components/common/NavigateByAuthState";
import { useAlert } from "../../../components/common/alert/AlertProvider";
import PhotoModal from "../../../components/config/PhotoModal";
import { PhotoPreviewButton } from "../../../components/config/PhotoPreview";
import UserAvatar from "../../../components/human/avatar";
import { facultiesAndDepartments } from "../../signup/data";

export default function EditProfile() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const { state } = useAboutMe();
  const data = state.data;
  const error = state.current === "error" ? state.error : null;
  const loading = state.current === "loading";

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

  const [nameError, setNameError] = useState<string>("");
  const [genderError, setGenderError] = useState<string>("");
  const [gradeError, setGradeError] = useState<string>("");
  const [facultyError, setFacultyError] = useState<string>("");
  const [departmentError, setDepartmentError] = useState<string>("");
  const [introError, setIntroError] = useState<string>("");

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

  function afterPhotoUpload(result: string) {
    try {
      setPictureUrl(result);
      handleSave({ pictureUrl: result });
    } catch (err) {
      console.error(err);
      // probably a network error
      onPhotoError(new Error("画像の更新に失敗しました"));
    }
  }

  function onPhotoError(err: Error) {
    enqueueSnackbar({
      message: err?.message ?? "画像の更新に失敗しました",
    });
  }
  const [open, setOpen] = useState<boolean>(false);

  function hasUnsavedChangesOrErrors() {
    return (
      isEditingName ||
      isEditingGender ||
      isEditingGrade ||
      isEditingFaculty ||
      isEditingDepartment ||
      isEditingIntro ||
      errorMessage ||
      nameError ||
      genderError ||
      gradeError ||
      facultyError ||
      departmentError ||
      introError
    );
  }

  function handleGoToCourses() {
    if (hasUnsavedChangesOrErrors()) {
      showAlert({
        AlertMessage: "まだ編集中のフィールド、もしくはエラーがあります",
        subAlertMessage: "本当にページを移動しますか？変更は破棄されます",
        yesMessage: "移動",
        clickYes: () => {
          router.push("/edit/courses");
        },
      });
    } else {
      router.push("/edit/courses");
    }
  }

  function handleBack() {
    if (hasUnsavedChangesOrErrors()) {
      showAlert({
        AlertMessage: "編集中のフィールド、もしくはエラーがあります。",
        subAlertMessage: "本当にページを移動しますか？変更は破棄されます",
        yesMessage: "移動",
        clickYes: () => {
          router.push("/settings/profile");
        },
      });
    } else {
      router.push("/settings/profile");
    }
  }

  async function handleSave(input: Partial<UpdateUser>) {
    setErrorMessage("");
    setNameError("");
    setGenderError("");
    setGradeError("");
    setFacultyError("");
    setDepartmentError("");
    setIntroError("");
    const data: UpdateUser = {
      name: (input.name ?? name).trim(),
      gender: input.gender ?? gender,
      grade: input.grade ?? grade,
      faculty: input.faculty ?? faculty,
      department: input.department ?? department,
      intro: (input.intro ?? intro).trim(),
      pictureUrl: input.pictureUrl ?? pictureUrl,
    };
    const result = UpdateUserSchema.safeParse(data);
    if (!result.success) {
      result.error.errors.map((err) => {
        switch (err.path[0]) {
          case "name":
            setNameError(err.message);
            break;
          case "gender":
            setGenderError(err.message);
            break;
          case "grade":
            setGradeError(err.message);
            break;
          case "faculty":
            setFacultyError(err.message);
            break;
          case "department":
            setDepartmentError(err.message);
            break;
          case "intro":
            setIntroError(err.message);
            break;
          default:
            setErrorMessage("入力に誤りがあります");
        }
      });
      return;
    }
    await update(data);
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

  const handleFacultyChange = (event: SelectChangeEvent<string>) => {
    setTmpFaculty(event.target.value);
  };

  const handleDepartmentChange = (event: SelectChangeEvent<string>) => {
    setTmpDepartment(event.target.value);
  };

  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      <Box sx={{ padding: "20px" }}>
        {loading ? (
          <FullScreenCircularProgress />
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : data ? (
          <Box mt={2} mx={2} display="flex" flexDirection="column" gap={2}>
            <Typography variant="h6" component="h1">
              プロフィール編集
            </Typography>
            <FormControl>
              <Box display="flex" alignItems="center">
                <TextField
                  value={tmpName}
                  onChange={(e) => setTmpName(e.target.value)}
                  label="名前"
                  disabled={!isEditingName}
                  fullWidth
                  error={!!nameError}
                  helperText={nameError}
                  autoComplete="off"
                />
                <IconButton
                  onClick={() => {
                    if (isEditingName) {
                      setName(tmpName);
                      handleSave({ name: tmpName });
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
                  error={!!genderError} // エラースタイル適用
                >
                  <MenuItem value={"男性"}>男性</MenuItem>
                  <MenuItem value={"女性"}>女性</MenuItem>
                  <MenuItem value={"その他"}>その他</MenuItem>
                  <MenuItem value={"秘密"}>秘密</MenuItem>
                </Select>
                {genderError && (
                  <Typography color="error" variant="caption">
                    {genderError}
                  </Typography>
                )}
                <IconButton
                  onClick={() => {
                    if (isEditingGender) {
                      setGender(tmpGender);
                      handleSave({ gender: tmpGender });
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
                  error={!!gradeError}
                >
                  <MenuItem value={"B1"}>1年生 (B1)</MenuItem>
                  <MenuItem value={"B2"}>2年生 (B2)</MenuItem>
                  <MenuItem value={"B3"}>3年生 (B3)</MenuItem>
                  <MenuItem value={"B4"}>4年生 (B4)</MenuItem>
                  <MenuItem value={"M1"}>修士1年 (M1)</MenuItem>
                  <MenuItem value={"M2"}>修士2年 (M2)</MenuItem>
                </Select>
                {gradeError && (
                  <Typography color="error" variant="caption">
                    {gradeError}
                  </Typography>
                )}
                <IconButton
                  onClick={() => {
                    if (isEditingGrade) {
                      setGrade(tmpGrade);
                      handleSave({ grade: tmpGrade });
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
                  error={!!facultyError}
                >
                  {Object.keys(facultiesAndDepartments).map((fac) => (
                    <MenuItem key={fac} value={fac}>
                      {fac}
                    </MenuItem>
                  ))}
                </Select>
                {facultyError && (
                  <Typography color="error" variant="caption">
                    {facultyError}
                  </Typography>
                )}

                <IconButton
                  onClick={() => {
                    if (isEditingFaculty) {
                      setDepartment("");
                      setFaculty(tmpFaculty);
                      handleSave({ faculty: tmpFaculty, department: "" });
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
                  error={!!departmentError} // エラースタイル適用
                >
                  {faculty &&
                    facultiesAndDepartments[faculty].map((dep) => (
                      <MenuItem key={dep} value={dep}>
                        {dep}
                      </MenuItem>
                    ))}
                </Select>
                {departmentError && (
                  <Typography color="error" variant="caption">
                    {departmentError}
                  </Typography>
                )}

                <IconButton
                  onClick={() => {
                    if (isEditingDepartment) {
                      setDepartment(tmpDepartment);
                      handleSave({ department: tmpDepartment });
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
                  autoComplete="off"
                  error={!!introError} // エラースタイル適用
                  helperText={introError} // エラーメッセージを表示
                />

                <IconButton
                  onClick={() => {
                    if (isEditingIntro) {
                      setIntro(tmpIntro);
                      handleSave({ intro: tmpIntro });
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
            {errorMessage && (
              <Box color="red" mb={2}>
                {errorMessage}
              </Box>
            )}

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <div style={{ textAlign: "left" }}>
                <Typography variant="h6" component="h1">
                  プロフィール画像
                </Typography>
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
                <PhotoModal
                  open={open}
                  closeFunc={() => setOpen(false)}
                  afterUpload={afterPhotoUpload}
                  onError={onPhotoError}
                />
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
                  minHeight: "61px",
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
    </NavigateByAuthState>
  );
}
