
@REM Get current working dir name to use as archive name.
@SET @archname= "AddressyTag.ocmod.zip"

@REM Try to delete the file only if it exists
@IF EXIST %@CURR_DIR%.tgz GOTO DELETE
@echo No archive with name '%@CURR_DIR%.tgz' currently exists, will create new archive.
@GOTO CREATE 

:DELETE
@del /F %@archname%
@printf \n
@echo Deleted old archive.

@IF EXIST %@archname% GOTO ERROR

:CREATE
@IF NOT EXIST "C:\Program Files\7-Zip" GOTO NO7ZIP

@MKDIR temp\upload\admin
@MKDIR temp\upload\catalog
@XCOPY admin\* temp\upload\admin\ /e
@XCOPY catalog\* temp\upload\catalog\ /e
@COPY install.xml temp\
@COPY README.md temp\
@CD temp\
@"C:\Program Files\7-Zip\7z.exe" a -tzip %@archname% * -xr!.git
@COPY %@archname% ..
@CD ..
@RD /S /Q temp
@GOTO SUCCESS

:ERROR 
@printf \n
@echo %@archname% could not be created, existing one could not be deleted.
@GOTO FINISH

:NO7ZIP
@printf \n
@echo 7-zip could not be found.
@GOTO FINISH

:SUCCESS
@printf \n
@echo %@archname% Created Successfully.

:FINISH