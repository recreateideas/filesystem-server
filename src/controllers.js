module.exports = {

    handleFilePath: async (req,res) => {

        console.log('Serving file-> ',req.params.path);
        res.sendFile(req.params.path);

    },

};
