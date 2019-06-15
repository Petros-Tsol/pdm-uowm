# Public Display Management System
Design and Implementation of a Public Display Management System for the University of Western Macedonia

## Description
This repository contains the source code of my bachelor thesis.
The system consists of a website and multiple base stations with an attached screen access to internet. The website includes a design tool for creating, without special knowledge, a enviroment which consists of various elements. This enviroment, is structured like a HTML webpage. The elements of the enviroment, are various data types like text, image and video.
Then we can push this enviroment to a base station. The role of the base station is to display it to a web browser, formatting it, according to the elements that have included. The base stations consists of a computer, with minimum requirements in hardware.

##Basic Installation and Instructions
*On the server install the LAMP stack.
*On server path copy every file of this repository.

*Obtain some low cost single board computer (like BeagleBoard-xM or Raspberry Pi) and install a Linux distribution.
*Attach a screen on it and an active internet connection.

*Open your browser to http://path/to/server/login_page.php and sign in the system.
*Design a layout and push it to a screen.

*Point the web browser of the single board computer to http://path/to/server/display.php?name=unique_id and replace `unique_id` with the unique identifier of this device. You can find this throught the management system.

##Demo
A short demo can be found here: https://youtu.be/yiB8-Q53aUM

##Extra
Full description of thesis and how we managed to develop this project can be found here: https://drive.google.com/file/d/0B0KsWEjXRuHTWXoyRE9DcFNBaWM/view (in Greek)
