import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
} from "@mui/material";

import { UpdateUser } from "../common/types";
// import userapi from "../api/user";
import { photo } from "./data/photo-preview";

type EditUserDialogProps = {
  isOpen: boolean;
  close: () => void;
  defaultValue: UpdateUser;
};

type Day = "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

const sampleRows = [
  {
    name: "1限",
    mon: ["2", "3"],
    tue: ["3"],
    wed: ["1"],
    thu: ["4"],
    fri: ["5"],
    sat: [""],
  },
  {
    name: "2限",
    mon: ["2"],
    tue: ["3"],
    wed: ["1"],
    thu: ["4"],
    fri: ["5"],
    sat: ["3"],
  },
  {
    name: "3限",
    mon: ["2"],
    tue: ["3"],
    wed: ["1"],
    thu: ["4"],
    fri: ["5"],
    sat: [""],
  },
  {
    name: "4限",
    mon: ["2"],
    tue: ["3"],
    wed: ["1"],
    thu: ["4"],
    fri: ["5"],
    sat: [""],
  },
  {
    name: "5限",
    mon: ["2"],
    tue: ["3"],
    wed: ["1"],
    thu: ["4"],
    fri: ["5"],
    sat: ["5"],
  },
  {
    name: "6限",
    mon: ["2"],
    tue: ["3"],
    wed: ["1"],
    thu: ["4"],
    fri: ["5"],
    sat: [""],
  },
];

const EditUserCourseDialog: React.FC<EditUserDialogProps> = (
  props: EditUserDialogProps,
) => {
  const { isOpen, close } = props;

  const [isSelectCourseDialogOpen, setIsSelectCourseDialogOpen] =
    useState(false);
  const [currentEdit, setCurrentEdit] = useState<{
    rowIndex: number;
    columnName: Day;
    courseIds: string[];
  } | null>(null);
  const [rows, setRows] = useState<
    {
      name: string;
      mon: string[];
      tue: string[];
      wed: string[];
      thu: string[];
      fri: string[];
      sat: string[];
    }[]
  >(sampleRows);

  const handleOpen = (
    rowIndex: number,
    columnName: Day,
    courseIds: string[],
  ) => {
    setCurrentEdit({ rowIndex, columnName, courseIds });
    setIsSelectCourseDialogOpen(true);
  };

  const handleClose = () => setIsSelectCourseDialogOpen(false);

  const onClose = () => {
    photo.upload = null;
    close();
  };

  const handleSave = async () => {
    // unimplemented
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>授業情報を編集</DialogTitle>
      <DialogContent>
        <DialogContentText>
          曜限を選択し、授業を登録してください。
        </DialogContentText>
        {/* <div>現在の授業</div> */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="center">月</TableCell>
              <TableCell align="center">火</TableCell>
              <TableCell align="center">水</TableCell>
              <TableCell align="center">木</TableCell>
              <TableCell align="center">金</TableCell>
              <TableCell align="center">土</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell
                  align="center"
                  onClick={() => handleOpen(rowIndex, "mon", row.mon)}
                >
                  {row.mon.map((course) => (
                    <div>{course}</div>
                  ))}
                </TableCell>
                <TableCell
                  align="center"
                  onClick={() => handleOpen(rowIndex, "tue", row.tue)}
                >
                  {row.tue.map((course) => (
                    <div>{course}</div>
                  ))}
                </TableCell>
                <TableCell
                  align="center"
                  onClick={() => handleOpen(rowIndex, "wed", row.wed)}
                >
                  {row.wed.map((course) => (
                    <div>{course}</div>
                  ))}
                </TableCell>
                <TableCell
                  align="center"
                  onClick={() => handleOpen(rowIndex, "thu", row.thu)}
                >
                  {row.thu.map((course) => (
                    <div>{course}</div>
                  ))}
                </TableCell>
                <TableCell
                  align="center"
                  onClick={() => handleOpen(rowIndex, "fri", row.fri)}
                >
                  {row.fri.map((course) => (
                    <div>{course}</div>
                  ))}
                </TableCell>
                <TableCell
                  align="center"
                  onClick={() => handleOpen(rowIndex, "sat", row.sat)}
                >
                  {row.sat.map((course) => (
                    <div>{course}</div>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isSelectCourseDialogOpen} onClose={handleClose}>
          <DialogTitle>
            {currentEdit
              ? `${currentEdit.columnName} ${currentEdit.rowIndex + 1}限の授業を選択`
              : "授業を選択"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>授業を選択してください。</DialogContentText>
            <TextField
              value={currentEdit?.courseIds.join(",")}
              onChange={(e) => {
                if (!currentEdit) return;
                setCurrentEdit({
                  ...currentEdit,
                  courseIds: e.target.value.split(",").map((v) => v.trim()),
                });
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              キャンセル
            </Button>
            <Button
              onClick={() => {
                if (!currentEdit) return;
                const newRows = [...rows];
                newRows[currentEdit.rowIndex][currentEdit.columnName] =
                  currentEdit.courseIds;
                setRows(newRows);
                handleClose();
              }}
              color="primary"
            >
              保存
            </Button>
          </DialogActions>
        </Dialog>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          キャンセル
        </Button>
        <Button onClick={handleSave} color="primary">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserCourseDialog;
