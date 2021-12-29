package com.kanboo.www.controller.access;

import com.kanboo.www.domain.entity.member.ProjectMember;
import com.kanboo.www.dto.member.MemberDTO;
import com.kanboo.www.dto.member.ProjectMemberDTO;
import com.kanboo.www.dto.project.ProjectDTO;
import com.kanboo.www.service.inter.project.SettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor

@RequestMapping("/setting")
public class SettingController {
    private final SettingService settingService;

    @PostMapping("/loadProjectMember")
    public List<ProjectMemberDTO> getProjectMemberData(@RequestBody Map<String, String> map){
        String prjctIdx = map.get("prjctIdx");
        Long longPrjctIdx = Long.parseLong(prjctIdx);
//        return settingService.getData(longPrjctIdx);
        return settingService.getProjectMemberData(longPrjctIdx);
    }

    @PostMapping("/loadProject")
    public ProjectDTO getProjectData(@RequestBody Map<String, String> map){
        String prjctIdx = map.get("prjctIdx");
        Long longPrjctIdx = Long.parseLong(prjctIdx);
        return settingService.getProjectData(longPrjctIdx);
    }

    @PostMapping("/searchProjectMember")
    public List<MemberDTO> searchProjectMember(@RequestBody Map<String, String> map){
        String searchKeyword = map.get("searchKeyword");

        return settingService.searchProjectMember(searchKeyword);
    }

    @PostMapping("/addProjectMember")
    public void addProjectMember(@RequestBody Map<String, List<ProjectMemberDTO>> map){
        List<ProjectMemberDTO> projectMemberDTOList = map.get("params");
        settingService.addProjectMember(projectMemberDTOList);
    }

    @PostMapping("/changeProjectDate")
    public void changeProjectDate(@RequestBody Map<String, ProjectDTO> map){
        ProjectDTO projectDTO = map.get("params");
        System.out.println(projectDTO);
        settingService.updateProjectDate(projectDTO);
    }
}
