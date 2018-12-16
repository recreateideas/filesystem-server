module.exports = {

    handleFilePath: async (req,res) => {

        console.log(req.params.path);
        res.sendFile(req.params.path);

    },

};
