module.exports = {

    handleFilePath: async (req,res) => {

        console.log(`@@@ :: ${new Date()} -> Serving file: ${req.params.path}`);
        res.sendFile(req.params.path);

    },

};
