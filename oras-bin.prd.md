Develope a node module and publish it to npm registry using github action. Consider below requirements

    - We have few binaries that needs to be executed with nodejs child process. This node modules should publish those executables binary based on OS. Consider all binary is placed root lib folder.

    - oras_1.2.2_linux_amd64.tar.gz
    - oras_1.2.2_darwin_arm64.tar.gz
    - oras_1.2.2_darwin_amd64.tar.gz
    - oras_1.2.2_linux_arm64.tar.gz
    - oras_1.2.2_windows_amd64.zip
    - MVP1: 

        ○ As part of MVP one just expose the path of the oras binary. 

        ○ Once use do `npm install oras-bin` its should download the npm package from registry and remove other binary from lib fodler not mathing with the user os, for example if user is using windows 64 bit amd, once installed its should remove all other binary except supoprted one for windows.

        ○ Code should dynamic enough to easily take the binary from the lib folder, so it will be easier to update binary in the next release without updating the code.

        ○ Export the binary path as oras , example `import oras from "oras-bin"`and child_process or spawn should use oras as binary path.

        ○ Write a simple unit test for "oras version"

        ○ Define github action workflow to publish the to npmjs registry with proper semver that should be managed in release pipeline, in every release it should update the next version.
Write readme.md with detailed usage example and instructions.