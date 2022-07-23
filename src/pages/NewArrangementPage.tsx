import {
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
} from "@mui/material";
import { ArrangementStore } from "../stores/arrangementStore";
import { globalStore } from "../stores/globalStore";
import { observer } from "mobx-react";
import { EmployeeDTO } from "../swagger/stubs";
import { mock } from "../mocks/mockData";
import { useEffect, useState } from "react";
import TimeTable from "../components/TimeTable/TimeTable";
import Typography from "@mui/material/Typography";
import { ComponentStatus } from "../interfaces/common";
import { companyService } from "../services/companyService";
import { LoadingPaper } from "../components/Loading/LoadingPaper";
import { arrangementService } from "../services/arrangementService";
import { useNavigate } from 'react-router-dom';
import { PagesUrl } from "../interfaces/pages.meta";

export const NewArrangementPage = observer(() => {
  const arrangementStore: ArrangementStore = globalStore.arrangementStore;
  const navigate = useNavigate();
  const [allRoles, setAllRoles] = useState<string[]>([]);
  const [allEmployees, setAllEmployees] = useState<EmployeeDTO[]>([]);
  const [allRules, setAllRules] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<ComponentStatus>(
    ComponentStatus.LOADING
  );

  useEffect(() => {
    const fetchRoles = async () => {
      const employees: EmployeeDTO[] = await companyService.getEmployees();
      const roles: string[] = await companyService.getRoles();
      setAllRoles(roles);
      setAllEmployees(employees);
      setAllRules(mock.rules); // TODO: add route to api and get rules metadata from there
      setIsLoading(ComponentStatus.READY);
    };
    fetchRoles();
  }, []);

  if (isLoading) {
    return <LoadingPaper />;
  }

  return (
    <Paper sx={{ margin: "auto", overflow: "hidden" }}>
      <div style={{ backgroundColor: "#fff", padding: "20px" }}>
        <TimeTable
          views={allRoles}
          slots={arrangementStore.reqSlots}
          setSlots={arrangementStore.setReqSlots}
        />
      </div>

      {/* ACTIVE EMPLOYEES */}
      <div
        style={{
          width: "270px",
          marginRight: "100px",
        }}
      >
        {/* TITLE */}
        <div
          style={{
            width: "100%",
            justifyContent: "center",
            display: "flex",
            margin: "20px 5px 5px 5px",
          }}
        >
          {/* SELECT ALL */}
          <Checkbox
            onChange={(e) => {
              if (e.target.checked) {
                allEmployees?.forEach((emp) =>
                  arrangementStore.setEmployeeAsActive(emp.id)
                );
              } else {
                allEmployees?.forEach((emp) =>
                  arrangementStore.unsetEmployeeAsActive(emp.id)
                );
              }
            }}
          />
          <Typography variant="h6" gutterBottom component="div">
            Active Employees
          </Typography>
        </div>
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "background.paper",
            borderRight: "inset",
            height: "300px",
            overflow: "auto",
          }}
        >
          {allEmployees?.map((employee: EmployeeDTO) => {
            const labelId = `active-employee-${employee.id}`;
            const isActive = arrangementStore?.activeEmployeesIds?.some(
              (employeeId) => employeeId === employee.id
            );
            return (
              <ListItem key={employee.name} disablePadding>
                <ListItemButton
                  onClick={() =>
                    isActive
                      ? arrangementStore.unsetEmployeeAsActive(employee.id)
                      : arrangementStore.setEmployeeAsActive(employee.id)
                  }
                >
                  <Checkbox checked={isActive} />
                  <ListItemText id={labelId} primary={`${employee.name}`} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </div>

      {/* RULE WEIGHTS */}
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {allRules?.map((rule: string) => {
          const labelId = `rule-${rule}`;
          return (
            <ListItem key={rule} disablePadding>
              <Checkbox
                onChange={(enable) =>
                  enable.target.checked
                    ? arrangementStore.enableRule(rule)
                    : arrangementStore.disableRule(rule)
                }
                checked={arrangementStore.selectedRules.some(
                  (selectedRule) =>
                    selectedRule.ruleName === rule && selectedRule.enable
                )}
              />
              <ListItemText id={labelId} primary={`${rule}`} />
              <TextField
                type="number"
                value={
                  arrangementStore.selectedRules.find(
                    (selectedRule) => selectedRule.ruleName === rule
                  )?.weight || undefined
                }
                variant="outlined"
                onChange={(e) =>
                  arrangementStore.setRuleWeight(
                    rule,
                    parseFloat(e.target.value)
                  )
                }
              />
            </ListItem>
          );
        })}
      </List>

      {/* CREATE BUTTON */}
      <div style={{ display: "flex", float: "right", padding: "40px" }}>
        <Button
          variant="contained"
          color="secondary"
          style={{ height: "50px", width: "100px" }}
          onClick={() => {
            arrangementService.sendProperties(arrangementStore.properties);
            navigate(PagesUrl.Arrangement_Status);
          }}
        >
          Create
        </Button>
      </div>
    </Paper>
  );
});
