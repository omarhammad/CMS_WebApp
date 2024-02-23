package com.example.clinicmanagementsystem.presentation.error;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.sql.SQLException;

@ControllerAdvice
@Controller
public class CustomErrorController {


    @GetMapping("/errors/")
    public String errorPage(Model model) {
        if (model.asMap().isEmpty()) {
            model.addAttribute("exception", null);
            model.addAttribute("url", null);

        }
        return "error";

    }

    @ExceptionHandler(value = Exception.class)
    public String defaultErrorHandler(HttpServletRequest req, Exception e, RedirectAttributes redirectAttributes) throws Exception {

        if (AnnotationUtils.findAnnotation(e.getClass(), ResponseStatus.class) != null) {
            throw e;
        }

        redirectAttributes.addFlashAttribute("exception", e.getCause() + ":" + e.getMessage());
        redirectAttributes.addFlashAttribute("url", req.getRequestURL().toString());
        return "redirect:/errors/";
    }


}
